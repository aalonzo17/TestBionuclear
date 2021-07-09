using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back_End.DTOS
{
    /*Este DTO se creo para la validacion de token donde tiene como propiedades el token y la fecha de expiracion del token*/
    public class RespuestaAutenticacion
    {
        public string Token { get; set; }
        public DateTime Expiracion { get; set; }
    }
}
