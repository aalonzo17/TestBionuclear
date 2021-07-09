using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Back_End.Migrations
{
    public partial class ordenesabiertas : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrdenesVentas",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    idCliente = table.Column<int>(type: "int", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    monto = table.Column<double>(type: "float", nullable: false),
                    descuento = table.Column<double>(type: "float", nullable: false),
                    montototal = table.Column<double>(type: "float", nullable: false),
                    fehca = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdenesVentas", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrdenesVentas");
        }
    }
}
