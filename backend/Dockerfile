FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copia requirements e instala dependências uma única vez
COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código da aplicação
COPY . .

# Comando padrão para rodar a aplicação (opcional)
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
