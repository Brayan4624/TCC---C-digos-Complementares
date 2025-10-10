import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Building2, GraduationCap, Mail, Lock, TrendingUp } from 'lucide-react'
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [profileType, setProfileType] = useState('student') // 'student' or 'company'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Nome é obrigatório'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', { ...formData, profileType, isLogin })
      alert(`${isLogin ? 'Login' : 'Cadastro'} realizado com sucesso!`)
    }
  }

  const handleProfileSelect = (type) => {
    setProfileType(type)
  }

  return (
    <div className="app-container">
      <div className="background-gradient"></div>
      
      <div className="content-wrapper">
        {/* Logo and Title */}
        <div className="logo-section">
          <div className="logo-icon">
            <TrendingUp className="w-12 h-12" />
          </div>
          <h1 className="app-title">NEXUS</h1>
          <p className="app-subtitle">Conectando talentos e oportunidades</p>
        </div>

        {/* Main Card */}
        <div className="main-card">
          <div className="card-header">
            <h2 className="card-title">
              {isLogin ? 'Entrar na sua conta' : 'Criar sua conta'}
            </h2>
            <p className="card-description">
              {isLogin 
                ? 'Entre para acessar suas oportunidades' 
                : 'Cadastre-se e comece sua jornada'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-container">
            {!isLogin && (
              <div className="form-field">
                <Label htmlFor="name" className="form-label">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
            )}

            <div className="form-field">
              <Label htmlFor="email" className="form-label">Email</Label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input input-with-icon ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-field">
              <Label htmlFor="password" className="form-label">Senha</Label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input input-with-icon ${errors.password ? 'input-error' : ''}`}
                />
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-field">
                <Label htmlFor="confirmPassword" className="form-label">Confirmar senha</Label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input input-with-icon ${errors.confirmPassword ? 'input-error' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            <Button type="submit" className="submit-button">
              {isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <div className="divider">
            <span>ou</span>
          </div>

          <div className="profile-section">
            <p className="profile-title">Acesso rápido</p>
            <div className="profile-buttons">
              <button
                type="button"
                onClick={() => handleProfileSelect('company')}
                className={`profile-button ${profileType === 'company' ? 'profile-button-active' : ''}`}
              >
                <Building2 className="w-5 h-5" />
                <span>Perfil Empresa</span>
              </button>
              <button
                type="button"
                onClick={() => handleProfileSelect('student')}
                className={`profile-button ${profileType === 'student' ? 'profile-button-active' : ''}`}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Perfil Estudante</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>
            {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
            {' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="toggle-button"
            >
              {isLogin ? 'Criar conta gratuita' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

