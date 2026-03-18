import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Users, Lock, Mail } from "lucide-react";
import { AuthService } from "@/data/services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const authService = new AuthService();
    try {
      const data = await authService.login(email, password);
      console.log("User logged in:", data.user);
      // redireciona para o dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        <div className="relative z-10 flex flex-col justify-center px-16 animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-sidebar-accent-foreground">GueziRH</h1>
              <p className="text-sidebar-muted text-sm">Sistema de Gestão de Trabalhadores da Maguezi</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-sidebar-accent-foreground mb-4 leading-tight">
            Gerencie sua equipe<br />
            <span className="text-primary">com eficiência.</span>
          </h2>

          <p className="text-sidebar-foreground text-lg max-w-md">
            Plataforma completa para gestão de trabalhadores, presenças, contratos e avaliações de desempenho.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="bg-sidebar-accent/50 rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sidebar-muted text-sm">Trabalhadores geridos</div>
            </div>
            <div className="bg-sidebar-accent/50 rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <div className="text-sidebar-muted text-sm">Taxa de satisfação</div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">GueziRH</h1>
            </div>
          </div>

          <div className="text-center mb-8">
            <img src="/images/logo.png" alt="Logo Guezi" className="mx-auto mb-4" width={120} />
            <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Entre com suas credenciais para acessar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              {/* <button
                type="button"
                className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Esqueci a senha
              </button> */}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-8">
            © {new Date().getFullYear()} GueziRH. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
