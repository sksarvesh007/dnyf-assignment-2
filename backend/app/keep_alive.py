import threading
import time
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def ping_server(url: str, interval_seconds: int = 840):
    def run():
        logger.info(f"Starting keep-alive pinger for {url} every {interval_seconds} seconds.")
        while True:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    logger.info(f"Keep-alive ping to {url} successful.")
                else:
                    logger.warning(f"Keep-alive ping to {url} returned status code {response.status_code}.")
            except Exception as e:
                logger.error(f"Keep-alive ping to {url} failed: {e}")
            
            time.sleep(interval_seconds)

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
