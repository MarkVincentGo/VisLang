package main

import (
	"log"
	"github.com/gofiber/fiber"
)

// type Body struct {
// 	Name string `json:”name,omitempty”`
// }

// InitApp ... create instance of fiber app
func InitApp() {
	app := fiber.New()
	mongoClient := InitMongo();

	app.Static("/", "../visual-language/build")

	app.Get("/load/:name", func(c *fiber.Ctx) error {
		name := c.Params("name");
		log.Println(name)
		program := GetProgram(mongoClient)
		return c.SendString("{\"Name\": \"" + program.Name + "\", \"Components\": " + program.Components + "}")
	})

	app.Post("/save", func(c *fiber.Ctx) error {
		p := new(Program)

		if err := c.BodyParser(p); err != nil {
			return err
		}

		InsertProgram(mongoClient, p.Name, p.Components)
		return c.SendString("done")
	})

	app.Listen(":4000")
}