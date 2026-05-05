import os
import requests
from django.core.files.storage import Storage
from django.conf import settings
from django.core.files.base import ContentFile
import uuid

class ProntoStorage(Storage):
    """
    Custom Django Storage backend for Get Pronto (getpronto.io).
    Implements the 3-step upload process (presign -> PUT -> confirm).
    """
    def __init__(self):
        self.api_key = getattr(settings, 'PRONTO_API_KEY', None)
        self.base_url = getattr(settings, 'PRONTO_BASE_URL', 'https://api.getpronto.io/v1')

    def _save(self, name, content):
        if not self.api_key:
            raise ValueError("PRONTO_API_KEY is not set in settings.")

        headers = {
            'Authorization': f'ApiKey {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        file_data = content.read()
        ext = os.path.splitext(name)[1].lower()
        unique_name = f"{uuid.uuid4()}{ext}"
        
        # Determine basic mime type for presign
        mime_type = 'application/octet-stream'
        if ext in ['.jpg', '.jpeg']: mime_type = 'image/jpeg'
        elif ext == '.png': mime_type = 'image/png'
        elif ext == '.gif': mime_type = 'image/gif'
        elif ext == '.webp': mime_type = 'image/webp'
        elif ext == '.svg': mime_type = 'image/svg+xml'

        try:
            # 1. Presign Upload
            presign_payload = {
                'filename': unique_name,
                'mimetype': mime_type,
                'size': len(file_data)
            }
            presign_res = requests.post(
                f"{self.base_url}/upload/presign", 
                headers=headers, 
                json=presign_payload
            )
            presign_res.raise_for_status()
            presign_data = presign_res.json()
            
            upload_url = presign_data['uploadUrl']
            pending_id = presign_data['pendingUploadId']

            # 2. Upload File (PUT)
            upload_res = requests.put(
                upload_url,
                headers={'Content-Type': mime_type},
                data=file_data
            )
            upload_res.raise_for_status()

            # 3. Confirm Upload
            confirm_payload = {'pendingUploadId': pending_id}
            confirm_res = requests.post(
                f"{self.base_url}/upload/confirm",
                headers=headers,
                json=confirm_payload
            )
            confirm_res.raise_for_status()
            
            confirm_data = confirm_res.json()
            
            if 'file' in confirm_data and 'secureUrl' in confirm_data['file']:
                return confirm_data['file']['secureUrl']
            else:
                print("Pronto Confirm Response:", confirm_data)
                raise KeyError(f"Could not find 'secureUrl' in Pronto response: {confirm_data}")
                
        except Exception as e:
            print(f"Error uploading to Pronto: {e}")
            raise e

    def exists(self, name):
        return False

    def url(self, name):
        return name
