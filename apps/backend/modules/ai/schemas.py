from pydantic import BaseModel
from typing import List


class Exercise(BaseModel):
    name: str
    sets: int
    reps: int
    rest_sec: int


class ProgramDay(BaseModel):
    day: int
    focus: str
    duration_min: int
    estimated_calories: int
    equipment: List[str]
    warmup: str
    cooldown: str
    exercises: List[Exercise]


class ProgramResponse(BaseModel):
    days: List[ProgramDay]


class ProgramRequest(BaseModel):
    text: str
