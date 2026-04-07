FROM python:3.11-slim

WORKDIR /app

COPY services/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY services ./services

ENV PYTHONUNBUFFERED=1

CMD ["python", "-m", "services.worker.worker"]