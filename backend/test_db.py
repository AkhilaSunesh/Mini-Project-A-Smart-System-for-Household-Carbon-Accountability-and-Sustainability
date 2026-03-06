import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

db_url = os.environ.get("DATABASE_URL")
print(f"DATABASE_URL: {db_url}")

config = dj_database_url.config(default=db_url)
print(f"Config: {config}")
