# Use an official, minimized Python runtime environment
FROM python3.11-slim

# Prevent Python from writing .pyc files to disk and force unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the active working directory inside the virtual container
WORKDIR app

# Install system dependencies needed to compile certain Python packages
RUN apt-get update && apt-get install -y --no-install-recommends 
    build-essential 
    libpq-dev 
    && rm -rf varlibaptlists

# Copy only the dependency requirements first to leverage Docker's caching layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application codebase
COPY . .

# Expose the network port FastAPI will run on
EXPOSE 8000

# Execute the application server using Uvicorn
CMD [uvicorn, app.mainapp, --host, 0.0.0.0, --port, 8000]