import express, { type Response, type Application, type Request } from "express";
import { z } from "zod";

const userSchema = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre debe ser un string",
      required_error: "El nombre es requerido",
    })
    .trim()
    .min(2, "El nombre debe de tener más de un caracter"),
  age: z
    .number({
      invalid_type_error: "La edad debe ser un número",
    })
    .min(18, "Debe ser mayor de edad"),
  email: z
    .string({
      invalid_type_error: "El email debe ser un string",
      required_error: "El email es requerido",
    })
    .email("El email no es válido"),
  cart: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number(),
      })
    )
    .min(1, "Carrito de compras vacío"),
});

const app: Application = express();

app.use(express.json());

app.post("/user", (req: Request, res: Response) => {
  const user = userSchema.safeParse(req.body);

  if (!user.success) {
    return res.status(400).json(user.error.flatten().fieldErrors);
  }

  return res.json(user.data);
});

app.get("/libros", (req: Request, res: Response) => {
  const { coleccion, autor } = req.query;
  res.send(`Colección ${coleccion} Autor: ${autor}`);
});

app.get("/libros/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`ID ${id}`);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
