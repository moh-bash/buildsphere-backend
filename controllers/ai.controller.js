const crypto = require("crypto");
const createPuter = require("../services/puter");

const generate3DModel = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const puter = await createPuter();

        const imageDataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const response = await puter.ai.chat(
            [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "change from 2d to 3d"
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageDataUrl
                            }
                        }
                    ]
                }
            ],
            {
                model: "gemini-3.1-flash-image-preview",
            }
        );

        let generatedImage;

        if (response?.message?.images && response.message.images.length > 0) {
            generatedImage = response.message.images[0].image_url.url;
        } else if (response?.message?.image) {
            generatedImage = response.message.image;
        } else {
            return res.status(500).json({ success: false, message: "AI did not return an image" });
        }

        if (generatedImage.startsWith("http")) {
            return res.json({
                success: true,
                image: generatedImage
            });
        }

        const filename = `${crypto.randomUUID()}.png`;

        const base64 = generatedImage.replace(/^data:image\/\w+;base64,/, "");

        const buffer = Buffer.from(base64, "base64");

        try {
            await puter.fs.mkdir("generated");
        } catch (e) {}

        const filePath = `generated/${filename}`;

        await puter.fs.write(filePath, buffer);

        const url = await puter.fs.getReadURL(filePath);

        res.json({
            success: true,
            image: url
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    generate3DModel
};