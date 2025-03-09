# AI-Based Medical Diagnosis Website

## Introduction

### Problem Statement
In today's healthcare system, medical diagnosis faces several challenges including human error and delays. Doctors are confronted with increasing amounts of patient data—symptoms, medical history, lab results, and imaging—making it challenging to analyze everything efficiently.

#### Key Challenges
- **Complexity & High Stakes**: Diagnosing diseases involves analyzing multiple variables under high-pressure conditions
- **Data Overload**: Large amounts of patient data make it difficult for healthcare professionals to extract critical insights quickly
- **Misdiagnosis Risks**: Due to the complexity of diseases and human limitations, misdiagnosis remains a significant concern
- **Disease Complexity**: Diseases present with varying symptoms, making accurate diagnosis challenging

### Proposed Solution
AI can streamline medical diagnosis by analyzing large volumes of patient data including symptoms, history, lab results, and imaging quickly and accurately.

**Key Benefits:**
- **Enhanced Decision-Making**: AI ensures comprehensive data analysis, supporting doctors with real-time insights
- **Improved Accuracy**: Reduces diagnostic errors and enhances the precision of medical evaluations
- **Faster Diagnoses**: Particularly beneficial in high-pressure settings such as emergency rooms
- **Better Patient Outcomes**: AI-assisted diagnosis leads to better healthcare decisions and improved treatment planning

## Software Requirements

### Technology Stack
- **Frontend**: Streamlit
- **Backend**: Python
- **Database**: PostgreSQL
- **Machine Learning Models**:
  - Support Vector Machine (SVM)
  - Logistic Regression
  - Random Forest
- **Framework**: Sklearn
- **Deployment**: Streamlit Cloud
- **ORM**: SQLAlchemy

## Complete Database Schema

### Database Creation
```sql
CREATE DATABASE medical_diagnosis_db;
\c medical_diagnosis_db

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Users Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    role VARCHAR(20) DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Patient Records Table
```sql
CREATE TABLE patient_records (
    record_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    family_history TEXT,
    blood_type VARCHAR(5),
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    emergency_contact TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_records_user_id ON patient_records(user_id);
```

### Medical Parameters Table
```sql
CREATE TABLE medical_parameters (
    parameter_id SERIAL PRIMARY KEY,
    record_id INTEGER REFERENCES patient_records(record_id) ON DELETE CASCADE,
    glucose_level DECIMAL(5,2),
    blood_pressure VARCHAR(20),
    skin_thickness DECIMAL(5,2),
    insulin_level DECIMAL(5,2),
    bmi DECIMAL(4,2),
    diabetes_pedigree_function DECIMAL(4,3),
    age INTEGER,
    measurement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_glucose_level CHECK (glucose_level > 0),
    CONSTRAINT chk_bmi CHECK (bmi > 0),
    CONSTRAINT chk_age CHECK (age > 0)
);

CREATE INDEX idx_medical_parameters_record_id ON medical_parameters(record_id);
CREATE INDEX idx_medical_parameters_date ON medical_parameters(measurement_date);
```

### Diseases Table
```sql
CREATE TABLE diseases (
    disease_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    common_symptoms TEXT[],
    risk_factors TEXT[],
    icd_10_code VARCHAR(10),
    severity_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_diseases_name ON diseases(name);
CREATE INDEX idx_diseases_icd_code ON diseases(icd_10_code);
```

### Symptoms Table
```sql
CREATE TABLE symptoms (
    symptom_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    severity_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_symptoms_name ON symptoms(name);
CREATE INDEX idx_symptoms_category ON symptoms(category);
```

### Disease_Symptoms Table
```sql
CREATE TABLE disease_symptoms (
    disease_id INTEGER REFERENCES diseases(disease_id) ON DELETE CASCADE,
    symptom_id INTEGER REFERENCES symptoms(symptom_id) ON DELETE CASCADE,
    relevance_score DECIMAL(3,2),
    PRIMARY KEY (disease_id, symptom_id),
    CONSTRAINT chk_relevance_score CHECK (relevance_score BETWEEN 0 AND 1)
);

CREATE INDEX idx_disease_symptoms_disease ON disease_symptoms(disease_id);
CREATE INDEX idx_disease_symptoms_symptom ON disease_symptoms(symptom_id);
```

### Diagnoses Table
```sql
CREATE TABLE diagnoses (
    diagnosis_id SERIAL PRIMARY KEY,
    record_id INTEGER REFERENCES patient_records(record_id) ON DELETE CASCADE,
    disease_id INTEGER REFERENCES diseases(disease_id),
    confidence_score DECIMAL(5,2),
    diagnosis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    model_version VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    reviewed_by INTEGER REFERENCES users(user_id),
    CONSTRAINT chk_confidence_score CHECK (confidence_score BETWEEN 0 AND 100)
);

CREATE INDEX idx_diagnoses_record ON diagnoses(record_id);
CREATE INDEX idx_diagnoses_disease ON diagnoses(disease_id);
CREATE INDEX idx_diagnoses_date ON diagnoses(diagnosis_date);
```

### Model_Performance Table
```sql
CREATE TABLE model_performance (
    performance_id SERIAL PRIMARY KEY,
    model_name VARCHAR(50),
    accuracy DECIMAL(5,2),
    precision DECIMAL(5,2),
    recall DECIMAL(5,2),
    f1_score DECIMAL(5,2),
    training_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dataset_version VARCHAR(50),
    parameters JSONB,
    CONSTRAINT chk_metrics CHECK (
        accuracy BETWEEN 0 AND 1 AND
        precision BETWEEN 0 AND 1 AND
        recall BETWEEN 0 AND 1 AND
        f1_score BETWEEN 0 AND 1
    )
);

CREATE INDEX idx_model_performance_date ON model_performance(training_date);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);
```

## System Architecture

The system follows a structured workflow for accurate diagnosis:

1. **Medical Dataset (Disease Symptoms)**
   - Initial dataset containing disease symptoms and patterns
   - Stored in a PostgreSQL database with normalized tables
   - Regular updates and maintenance of the disease-symptom relationships

2. **Pre-processing**
   - Data Cleaning: Removes inconsistencies and errors
   - Data Transformation: Converts data into structured format
   - Database normalization and validation

3. **Feature Extraction**
   - Extracts key features representing disease symptoms

4. **Model Training**
   - Implements machine learning models (SVM, Logistic Regression, Random Forest)
   - Trains on processed dataset

5. **Medical Test Data Processing**
   - Processes new test data to match training format

6. **Prediction Model**
   - Utilizes trained models for disease prediction

7. **Disease Prediction Output**
   - Presents prediction results and confidence levels

## Project Implementation Plan

### Phase 1: Data Collection & Preprocessing
1. Requirements analysis and objective definition
2. Dataset collection and validation
3. Data cleaning and preprocessing

### Phase 2: Model Training & Web Development
1. Model training and validation
2. Performance evaluation and optimization
3. Web application development using Streamlit

### Phase 3: Deployment & Documentation
1. Application deployment on Streamlit Cloud
2. Documentation preparation
3. Project submission and presentation

## Website Features

### Homepage
- Overview of the AI-powered diagnosis system
- System capabilities and limitations
- User guidance and instructions

### User Input Interface
**Medical Parameters Input:**
- Glucose Level
- Blood Pressure
- Skin Thickness
- Insulin Level
- BMI Value
- Diabetes Pedigree Function
- Age

### Prediction System
- Data processing pipeline
- ML model prediction
- Result visualization and explanation

### Technical Implementation
- Input data preprocessing
- Feature vector generation
- Model prediction pipeline
- Result presentation
- Database operations and transactions
- Data validation and sanitization
- Secure API endpoints for data access

## Future Scope

### Planned Enhancements
1. **Extended Disease Coverage**: Implementation of additional disease diagnosis capabilities
2. **NLP Integration**: Analysis of unstructured medical data and literature
3. **Wearable Integration**: Real-time health data collection and monitoring
4. **Predictive Analytics**: Disease progression forecasting
5. **Telemedicine Integration**: Remote consultation capabilities
6. **Personalized Treatment**: AI-driven treatment recommendations
7. **Multilingual Support**: Global accessibility through language options
8. **Advanced Database Features**: 
   - Real-time analytics
   - Data warehousing
   - Time-series analysis
   - Automated backup and recovery
   - Horizontal scaling

## Conclusion

This AI-based medical diagnosis system represents a significant advancement in healthcare technology, offering accurate, rapid, and reliable disease predictions. The system's future development roadmap includes real-time monitoring, predictive analytics, and personalized treatment recommendations, positioning it to make a substantial impact in medical diagnostics.

## Project Structure

```plaintext
medical_diagnosis_website/
├── .github/                      # GitHub Actions workflows
│   └── workflows/
│       └── ci_cd.yml
├── .gitignore
├── README.md
├── requirements.txt
├── setup.py
├── config/
│   ├── __init__.py
│   ├── settings.py              # Application settings
│   └── logging_config.py        # Logging configuration
├── docs/
│   ├── CONTEXT.md
│   ├── API.md
│   └── DATABASE.md
├── src/
│   ├── __init__.py
│   ├── main.py                  # Application entry point
│   ├── database/
│   │   ├── __init__.py
│   │   ├── models.py           # SQLAlchemy models
│   │   ├── schemas.py          # Pydantic schemas
│   │   └── database.py         # Database connection
│   ├── ml_models/
│   │   ├── __init__.py
│   │   ├── svm_model.py
│   │   ├── logistic_regression.py
│   │   └── random_forest.py
│   ├── preprocessing/
│   │   ├── __init__.py
│   │   ├── data_cleaner.py
│   │   └── feature_engineering.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   └── diagnoses.py
│   │   └── middleware/
│   │       ├── __init__.py
│   │       └── auth_middleware.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── diagnosis_service.py
│   │   └── user_service.py
│   └── utils/
│       ├── __init__.py
│       ├── validators.py
│       └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_models/
│   ├── test_api/
│   └── test_services/
├── frontend/
│   ├── __init__.py
│   ├── pages/
│   │   ├── __init__.py
│   │   ├── home.py
│   │   ├── diagnosis.py
│   │   └── profile.py
│   ├── components/
│   │   ├── __init__.py
│   │   ├── sidebar.py
│   │   └── forms.py
│   └── assets/
│       ├── css/
│       ├── js/
│       └── images/
└── scripts/
    ├── init_db.py
    ├── seed_data.py
    └── deployment/
        ├── Dockerfile
        └── docker-compose.yml
```

