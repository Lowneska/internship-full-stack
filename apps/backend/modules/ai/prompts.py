###########################
# AI Prompt Definitions
###########################


## OpenAI prompt
SYSTEM_PROMPT = """
Tu es un assistant spécialisé dans la création de programmes sportifs personnalisés.

Ta tâche : à partir d'un texte libre fourni par l'utilisateur (objectifs, contraintes, matériel, niveau, disponibilité), produire un JSON STRICTEMENT conforme au type suivant :

{
  "days": [
    {
      "day": number,
      "focus": "string",
      "duration_min": number,
      "estimated_calories": number,
      "equipment": ["string"],
      "warmup": "string",
      "cooldown": "string",
      "exercises": [
        {
          "name": "string",
          "sets": number,
          "reps": number,
          "rest_sec": number
        }
      ]
    }
  ]
}

RÈGLES IMPORTANTES :
- Réponds UNIQUEMENT avec un JSON valide.
- Aucun texte avant ou après le JSON.
- Pas de commentaires.
- Pas de virgules finales.
- Structure EXACTEMENT conforme au type ProgramResponse donné.
- Le nombre de jours doit correspondre aux séances/semaine décrites par l'utilisateur. S'il ne précise pas : génère 3 jours.
- Les exercices doivent être réalistes et adaptés au matériel de l'utilisateur.
- "warmup" et "cooldown" doivent être de courtes phrases.

Ta sortie doit être STRICTEMENT un JSON valide respectant le schéma ci-dessus. Aucun autre texte.
"""

# JSON Schema for validating the AI response
PROGRAM_RESPONSE_JSON_SCHEMA = {
    "name": "program_response",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "days": {
                "type": "array",
                "minItems": 1,
                "items": {
                    "type": "object",
                    "properties": {
                        "day": {"type": "integer", "minimum": 1},
                        "focus": {"type": "string"},
                        "duration_min": {"type": "integer", "minimum": 1},
                        "estimated_calories": {"type": "integer", "minimum": 0},
                        "equipment": {"type": "array", "items": {"type": "string"}},
                        "warmup": {"type": "string"},
                        "cooldown": {"type": "string"},
                        "exercises": {
                            "type": "array",
                            "minItems": 1,
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "sets": {"type": "integer", "minimum": 1},
                                    "reps": {"type": "integer", "minimum": 1},
                                    "rest_sec": {"type": "integer", "minimum": 0},
                                },
                                "required": ["name", "sets", "reps", "rest_sec"],
                                "additionalProperties": False,
                            },
                        },
                    },
                    "required": [
                        "day",
                        "focus",
                        "duration_min",
                        "estimated_calories",
                        "equipment",
                        "warmup",
                        "cooldown",
                        "exercises",
                    ],
                    "additionalProperties": False,
                },
            }
        },
        "required": ["days"],
        "additionalProperties": False,
    },
}
