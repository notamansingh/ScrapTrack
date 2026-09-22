import os
import uuid
import aioboto3
from botocore.config import Config
from dotenv import load_dotenv
from fastapi import UploadFile

load_dotenv()

R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "scraptrack-uploads")
R2_ENDPOINT_URL = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"


def _r2_client():
    return aioboto3.Session().client(
        "s3",
        endpoint_url=R2_ENDPOINT_URL,
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name="auto",
        config=Config(signature_version="s3v4"),
    )


async def get_receipt_url(object_key: str, expires_in: int = 3600) -> str:
    async with _r2_client() as s3_client:
        return await s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": R2_BUCKET_NAME, "Key": object_key},
            ExpiresIn=expires_in,
        )


async def upload_image_to_r2(file: UploadFile) -> str:
    # Generate a unique key using uuid: e.g., f"disposals/{uuid.uuid4()}-{file.filename}"
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    object_key = f"disposals/{uuid.uuid4()}.{file_extension}"

    async with _r2_client() as s3_client:
        contents = await file.read()
        await s3_client.put_object(
            Bucket = R2_BUCKET_NAME,
            Key = object_key,
            Body = contents,
            ContentType = file.content_type or "image/jpeg"
        )
    # Return the file key
    return object_key