using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Back_End.Entidades
{
    /*Esta es la entidad que representa los ordenes de ventass de los clientes*/
    public class OrdenesVentas
    {
        [Key]
        public int id { get; set; }
        public int idCliente { get; set; }
        public string Descripcion { get; set; }
        public double monto { get; set; }
        public double descuento { get; set; }
        public double montototal { get; set; }
        public DateTime fecha { get; set; }

    }
}
