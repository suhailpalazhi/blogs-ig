import os
import requests
from django.core.files.storage import Storage
from django.conf import settings
from django.core.files.base import ContentFile
import uuid

class ProntoStorage(Storage):
    """
    Custom Django Storage backend for Get Pronto (getpronto.io).
    This assumes a standard REST API upload.
    """
    def __init__(self):
        self.api_key = getattr(settings, 'PRONTO_API_KEY', None)
        # Default endpoint assumed. Update this if Pronto documentation specifies a different one.
        self.upload_url = getattr(settings, 'PRONTO_UPLOAD_URL', 'https://api.getpronto.io/v1/files')

    def _save(self, name, content):
        if not self.api_key:
            raise ValueError("PRONTO_API_KEY is not set in settings.")

        headers = {
            'Authorization': f'Bearer {self.api_key}'
        }
        
        # Read the file content
        file_data = content.read()
        
        # Construct a unique filename to prevent collisions
        ext = os.path.splitext(name)[1]
        unique_name = f"{uuid.uuid4()}{ext}"
        
        files = {
            'file': (unique_name, file_data)
        }

        try:
            response = requests.post(self.upload_url, headers=headers, files=files)
            response.raise_for_status()  # Raise an exception for bad status codes
            
            data = response.json()
            
            # NOTE: We assume the response JSON has a 'url' field.
            # If Pronto uses a different key (e.g., 'asset_url' or 'data.url'), update this!
            if 'url' in data:
                return data['url']
            elif 'data' in data and 'url' in data['data']:
                return data['data']['url']
            else:
                # Fallback: if we can't find the URL in the response, return the raw text
                # so the user can debug it
                print("Pronto Response:", data)
                raise KeyError(f"Could not find 'url' in Pronto response: {data}")
                
        except Exception as e:
            print(f"Error uploading to Pronto: {e}")
            raise e

    def exists(self, name):
        # We return False so Django always generates a new upload instead of checking 
        # if the file exists on Pronto (which saves an API call).
        return False

    def url(self, name):
        # Since _save returns the absolute URL from Pronto, Django saves the absolute URL in the DB.
        # Therefore, we just return the name (which is the full URL).
        return name
