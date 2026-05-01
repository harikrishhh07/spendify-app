import os
from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from models import db
from routes import api_bp

mail = Mail()

def create_app():
    app = Flask(__name__)
    CORS(app) # Allow frontend to communicate with backend
    
    # Configure SQLite Database by default
    # To switch to MySQL, you would use:
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost/antigravity_db'
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Hari%4020058989007@localhost/spendify'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Flask-Mail Configuration (Gmail SMTP)
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your-email@gmail.com')
    app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your-app-password')
    app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME', 'your-email@gmail.com')
    
    db.init_app(app)
    mail.init_app(app)
    
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
