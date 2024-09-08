namespace JeLSolucoesFiscais.Aplicacao.Usuario;

public class UsuariosCadastrados
{
    public List<Usuario> Usuarios()
    {
        List<Usuario> usuarios = new List<Usuario>
        {
            new Usuario { Email = "bHVjaWFubw==", Senha = "MTIzNDU2Nzg5", FimAcesso = DateTime.Now.AddMonths(1) },
            new Usuario { Email = "amhvbg==", Senha = "MTIzNA==", FimAcesso = DateTime.Now.AddMonths(1) }
        };

        return usuarios;
    }

    public bool VerificaCadastrousuario(string Email, string Senha) 
    {
        byte[] bytesEmail = System.Text.Encoding.UTF8.GetBytes(Email);
        byte[] bytesSenha = System.Text.Encoding.UTF8.GetBytes(Senha);

        string base64Email = Convert.ToBase64String(bytesEmail);
        string base64Senha = Convert.ToBase64String(bytesSenha);

        var usuario = Usuarios().FirstOrDefault(u => u.Email == base64Email && u.Senha == base64Senha);

        bool usuarioExiste = Usuarios().Any(u => u.Email == base64Email && u.Senha == base64Senha);

        if (usuarioExiste)
        {
            return true;
        }
        else
        {
            return false;
        }

    }

}
