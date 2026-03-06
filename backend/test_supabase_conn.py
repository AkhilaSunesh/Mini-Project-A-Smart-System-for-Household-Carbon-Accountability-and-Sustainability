import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

def test_connection():
    try:
        # Use DATABASE_URL for connection
        db_url = os.getenv('DATABASE_URL')
        print(f"Testing connection to: {db_url.split('@')[-1]}")
        
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()
        print(f"Successfully connected! PostgreSQL version: {version[0]}")
        
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return False

if __name__ == "__main__":
    test_connection()
