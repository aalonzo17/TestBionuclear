using Back_End.DTOS;
using Back_End.Utilidades;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Back_End.Controllers
{
    //API DEFINIDA PARA LA ENTIDAD USUARIO
    [Route("api/usuarios")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UsuariosController : ControllerBase
    {
        //VARIABLES DE AMBIENTES DE IDENTITY PARA MANEJAR LOS USUARIOS 
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly IConfiguration configuration;
        private readonly AplicationDbContext context;

        //CONSTRUCTOR
        public UsuariosController(UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IConfiguration configuration,
            AplicationDbContext context)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.context = context;
        }

        //METODO DEL API TIPO GET QUE DEVUELVE UN LISTADO DE USUARIOS
        [HttpGet("listadoUsuarios")]
        
        public async Task<ActionResult<List<UsuarioDTO>>> ListadoUsuarios([FromQuery] PaginacionDTO paginacionDTO)
        {
            var queryable = context.Users.AsQueryable();
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            return await queryable.Select(x => new UsuarioDTO { Id = x.Id, Email = x.Email}).Paginar(paginacionDTO).ToListAsync();
        }

        //METODO DE API TIPO POST QUE AGREGA EL ROL ADMIN A LOS USUARIOS

        [HttpPost("HacerAdmin")]
        public async Task<ActionResult> HacerAdmin([FromBody] string usuarioId)
        {
            var usuario = await userManager.FindByIdAsync(usuarioId);
            await userManager.AddClaimAsync(usuario, new Claim("role", "admin"));
            return NoContent();
        }

        //METODO DEL API TIPO POST QUE REMUEVE EL ROL ADMIN A LOS USUARIOS
        [HttpPost("RemoverAdmin")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> RemoverAdmin([FromBody] string usuarioId)
        {
            var usuario = await userManager.FindByIdAsync(usuarioId);
            await userManager.RemoveClaimAsync(usuario, new Claim("role", "admin"));
            return NoContent();
        }

        //METODO DEL API TIPO POST QUE RESGISTRA Y CREA UN USUARIO PARA LA PRUEBA SE AGREGA EL ROL ADMIN DESDE LA CREACION 
        //Y PERMITE SU ACESSO COMO ANONIMO
        [AllowAnonymous]
        [HttpPost("crear")]
        public async Task<ActionResult<RespuestaAutenticacion>> Crear([FromBody] CredencialesUsuario credenciales)
        {
            var usuario = new IdentityUser { UserName = credenciales.Email, Email = credenciales.Email };
            var resultado = await userManager.CreateAsync(usuario, credenciales.Password);
            if (resultado.Succeeded)
            {
                var inicio = await signInManager.PasswordSignInAsync(credenciales.Email, credenciales.Password,
                    isPersistent: false, lockoutOnFailure: false);                

                if (inicio.Succeeded)
                {
                    await userManager.AddClaimAsync(usuario, new Claim("role", "admin"));
                    return await ConstruirToken(credenciales);
                }
                else
                {
                    return BadRequest(resultado.Errors);
                }

            }
            else
            {
                return BadRequest(resultado.Errors);
            }
        }

        //METODO DEL API TIPO POS QUE VALIDA LA AUTENTICACION DEL USUARIO EN EL LOGIN Y PERMITE SU ACCESO COMO ANONIMO
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<RespuestaAutenticacion>> Login([FromBody] CredencialesUsuario credenciales)
        {
            var resultado = await signInManager.PasswordSignInAsync(credenciales.Email, credenciales.Password,
                isPersistent: false, lockoutOnFailure: false);

            if (resultado.Succeeded)
            {
                return await ConstruirToken(credenciales);
            }
            else
            {
                return BadRequest("Nombre de usuario o la contraseña esta incorreta.");
            }
        }

        /*METODO INTERNO DEL API QUE REALIZA LA CREACION DE WEB TOKEN PARA LAS VALIDACIONES DE
        LA SESSION DEL USUARIO SE CREA CON FECHA DE VENCIMIENTO DE UN ANO PERO SE PUEDE DEFINIR*/

        private async Task<RespuestaAutenticacion> ConstruirToken(CredencialesUsuario credenciales)
        {
            var claims = new List<Claim>()
            {
                new Claim("email", credenciales.Email)
            };

            var usuario = await userManager.FindByEmailAsync(credenciales.Email);
            var claimsDB = await userManager.GetClaimsAsync(usuario);

            claims.AddRange(claimsDB);

            var llave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["llavejwt"]));
            var creds = new SigningCredentials(llave, SecurityAlgorithms.HmacSha256);

            var expiracion = DateTime.UtcNow.AddYears(1);

            var token = new JwtSecurityToken(issuer: null, audience: null, claims: claims,
                expires: expiracion, signingCredentials: creds);

            return new RespuestaAutenticacion()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiracion = expiracion
            };
        }

    }
}
