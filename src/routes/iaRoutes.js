const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Nos aseguramos de que lea tu archivo .env

// Inicializamos la IA de Google con tu clave secreta
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/consultar', async (req, res) => {
    try {
        const { mensaje, vehiculo } = req.body;

        // 1. Configuramos el contexto (Los datos del carro que vienen desde React)
        let infoVehiculo = vehiculo 
            ? `El cliente está consultando sobre un ${vehiculo.marca} ${vehiculo.modelo} con placa ${vehiculo.placa}.`
            : `El cliente aún no ha seleccionado un vehículo específico.`;

        // 2. Le damos la personalidad (System Prompt)
        const systemPrompt = `
            Eres JTRACK AI, el asistente virtual experto en mecánica y mantenimiento preventivo de la aplicación JTRACK.
            ${infoVehiculo}
            
            Tus reglas:
            1. Responde preguntas sobre repuestos, mantenimiento, fallas, tiempos de cambio de aceite, frenos, llantas, etc.
            2. Sé amable, directo y muy profesional. Usa un lenguaje fácil de entender.
            3. Tus respuestas deben ser cortas (máximo 3 o 4 líneas).
            4. Si el usuario pregunta algo que NO tiene nada que ver con vehículos o mecánica, dile amablemente que solo estás programado para ayudar con temas automotrices.
            5. Si la falla parece grave, siempre recomienda llevar el vehículo a un taller afiliado a JTRACK.
        `;

        // 3. Seleccionamos el modelo "gemini-1.5-flash" (El modelo gratuito y ultra rápido)
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt // Le inyectamos las reglas aquí
        });

        // 4. Enviamos la pregunta del usuario a la IA
        const result = await model.generateContent(mensaje);
        const respuestaIA = result.response.text();

        // 5. Devolvemos la respuesta al Dashboard de React
        res.json({ respuesta: respuestaIA });

    } catch (error) {
        console.error("Error en el servidor de IA de Google:", error);
        res.status(500).json({ respuesta: "Lo siento, mis circuitos están fallando. No pude conectarme al servidor principal." });
    }
});

module.exports = router;