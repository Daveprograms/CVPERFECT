from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import google.generativeai as genai
from datetime import datetime
import uuid
import json

from ..database import get_db
from ..models.user import User, SubscriptionType
from ..models.resume import Resume, ResumeVersion
from ..models.analytics import Analytics, ActionType
from ..schemas.resume import (
    ResumeCreate,
    ResumeResponse,
    ResumeEnhanceRequest,
    ResumeScoreResponse,
    CoverLetterRequest,
    CoverLetterResponse
)
from ..core.ai import enhance_resume, score_resume, generate_cover_letter
from ..core.linkedin import extract_linkedin_profile
from .auth import get_current_user

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    resume_data: ResumeCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check subscription limits
    if current_user.subscription_type == SubscriptionType.FREE:
        raise HTTPException(
            status_code=403,
            detail="Free users cannot upload resumes. Please upgrade your subscription."
        )
    elif current_user.subscription_type == SubscriptionType.ONE_TIME:
        if current_user.remaining_enhancements <= 0:
            raise HTTPException(
                status_code=403,
                detail="No remaining enhancements. Please purchase more or upgrade to Pro."
            )

    # Create resume
    resume = Resume(
        user_id=current_user.id,
        original_content=resume_data.content,
        job_description=resume_data.job_description,
        linkedin_url=resume_data.linkedin_url
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Create initial version
    version = ResumeVersion(
        resume_id=resume.id,
        content=resume_data.content,
        version_number=1
    )
    db.add(version)

    # Track analytics
    analytics = Analytics(
        user_id=current_user.id,
        resume_id=resume.id,
        action_type=ActionType.RESUME_UPLOAD,
        metadata={
            "has_job_description": bool(resume_data.job_description),
            "has_linkedin": bool(resume_data.linkedin_url)
        }
    )
    db.add(analytics)

    # If LinkedIn URL provided, extract profile in background
    if resume_data.linkedin_url:
        background_tasks.add_task(
            extract_linkedin_profile,
            resume_data.linkedin_url,
            resume.id,
            db
        )

    db.commit()
    return resume

@router.post("/enhance", response_model=ResumeResponse)
async def enhance_resume_endpoint(
    request: ResumeEnhanceRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get resume
    resume = db.query(Resume).filter(
        Resume.id == request.resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Check subscription limits
    if current_user.subscription_type == SubscriptionType.FREE:
        raise HTTPException(
            status_code=403,
            detail="Free users cannot enhance resumes. Please upgrade your subscription."
        )
    elif current_user.subscription_type == SubscriptionType.ONE_TIME:
        if current_user.remaining_enhancements <= 0:
            raise HTTPException(
                status_code=403,
                detail="No remaining enhancements. Please purchase more or upgrade to Pro."
            )
        current_user.remaining_enhancements -= 1

    # Enhance resume in background
    background_tasks.add_task(
        enhance_resume,
        resume.id,
        request.job_description or resume.job_description,
        db
    )

    # Track analytics
    analytics = Analytics(
        user_id=current_user.id,
        resume_id=resume.id,
        action_type=ActionType.RESUME_ENHANCE,
        metadata={
            "has_job_description": bool(request.job_description)
        }
    )
    db.add(analytics)
    db.commit()

    return resume

@router.get("/score/{resume_id}", response_model=ResumeScoreResponse)
async def get_resume_score(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if not resume.score:
        # Score resume in background
        score, feedback, suggestions = await score_resume(
            resume.enhanced_content or resume.original_content,
            resume.job_description
        )
        resume.score = score
        resume.feedback = feedback
        resume.learning_suggestions = suggestions
        db.commit()

    return {
        "score": resume.score,
        "feedback": resume.feedback,
        "learning_suggestions": resume.learning_suggestions
    }

@router.post("/cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter_endpoint(
    request: CoverLetterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get resume
    resume = db.query(Resume).filter(
        Resume.id == request.resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Check subscription
    if current_user.subscription_type == SubscriptionType.FREE:
        raise HTTPException(
            status_code=403,
            detail="Free users cannot generate cover letters. Please upgrade your subscription."
        )

    # Generate cover letter
    cover_letter = await generate_cover_letter(
        resume.enhanced_content or resume.original_content,
        request.job_description,
        request.company_name,
        request.position
    )

    # Update resume
    resume.cover_letter = cover_letter
    db.commit()

    # Track analytics
    analytics = Analytics(
        user_id=current_user.id,
        resume_id=resume.id,
        action_type=ActionType.COVER_LETTER_GENERATE,
        metadata={
            "company_name": request.company_name,
            "position": request.position
        }
    )
    db.add(analytics)
    db.commit()

    return {"cover_letter": cover_letter}

@router.get("/list", response_model=List[ResumeResponse])
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.created_at.desc()).all()

@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}

@router.post("/analyze", response_model=dict)
async def analyze_resume(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze resume with detailed feedback and suggestions"""
    try:
        data = await request.json()
        resume_id = data.get('resume_id')
        
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        ).first()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
            
        # Get detailed analysis from Gemini
        analysis = await analyze_resume_content(
            resume.enhanced_content or resume.original_content,
            resume.job_description
        )
        
        # Track analytics
        analytics = Analytics(
            user_id=current_user.id,
            resume_id=resume.id,
            action_type=ActionType.RESUME_ANALYZE
        )
        db.add(analytics)
        db.commit()
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[dict])
async def get_resume_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's resume enhancement history"""
    try:
        history = db.query(Analytics).filter(
            Analytics.user_id == current_user.id,
            Analytics.action_type.in_([
                ActionType.RESUME_UPLOAD,
                ActionType.RESUME_ENHANCE,
                ActionType.RESUME_ANALYZE
            ])
        ).order_by(Analytics.created_at.desc()).all()
        
        return [
            {
                "action": h.action_type,
                "timestamp": h.created_at,
                "resume_id": h.resume_id,
                "metadata": h.metadata
            }
            for h in history
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/developer-code", response_model=dict)
async def validate_developer_code(
    request: Request,
    db: Session = Depends(get_db)
):
    """Validate developer code and grant pro access"""
    try:
        data = await request.json()
        code = data.get('code')
        
        # Validate code (implement your validation logic)
        if not is_valid_developer_code(code):
            raise HTTPException(status_code=400, detail="Invalid developer code")
            
        # Get user from request
        current_user = await get_current_user(request, db)
        
        # Grant pro access
        current_user.subscription_type = SubscriptionType.PRO
        current_user.remaining_enhancements = -1  # Unlimited
        db.commit()
        
        return {"message": "Pro access granted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download-tracker", response_model=dict)
async def get_download_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's download statistics"""
    try:
        downloads = db.query(Analytics).filter(
            Analytics.user_id == current_user.id,
            Analytics.action_type == ActionType.RESUME_DOWNLOAD
        ).all()
        
        return {
            "total_downloads": len(downloads),
            "remaining_downloads": (
                -1 if current_user.subscription_type == SubscriptionType.PRO
                else max(0, 4 - len(downloads))
            ),
            "download_history": [
                {
                    "timestamp": d.created_at,
                    "format": d.metadata.get('format'),
                    "resume_id": d.resume_id
                }
                for d in downloads
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 