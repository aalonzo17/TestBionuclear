using Back_End.Entidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back_End.Controllers
{
    //API DEFINIDO PARA LAS ORDENES DE VENTAS
    [Route("api/ordenes")]
    [ApiController]
    public class OrdenesVentasController : Controller
    {
        private readonly AplicationDbContext _aplicationDbContext;
        public OrdenesVentasController(AplicationDbContext aplicationDbContext)
        {
            _aplicationDbContext = aplicationDbContext;
        }

        //METODO DEL API QUE CREA 25 ORDENES DE VENTAS POR CADA CLIENTE CON VALORES RANDOM
        [HttpPost("todas")]
        public void todas()
        {
            List<Clientes> cl = _aplicationDbContext.clientes.AsQueryable().ToList();
            foreach (var c in cl)
            {
                Random rnd = new Random();
                int cant = 25;
                string des = "Orden de venta";
                List<double> mon = new List<double> { 100, 150.3, 200.25, 500.50 };
                List<double> desc = new List<double> { 0, 25 };
                for (int i = 0; i < cant; i++)
                {
                    int monto = (int)mon[rnd.Next(mon.Count)];
                    int descuento = (int)desc[rnd.Next(desc.Count)];

                    OrdenesVentas v = new OrdenesVentas
                    {
                        idCliente = Convert.ToInt32(c.id),
                        Descripcion = des,
                        monto = monto,
                        descuento = descuento,
                        montototal = (monto - descuento),
                        fecha = DateTime.Now
                    };
                    _aplicationDbContext.OrdenesVentas.Add(v);
                    _aplicationDbContext.SaveChangesAsync();
                }
            }   
        }
    }
}
