const { HfInference } = require('@huggingface/inference');
const env = require('dotenv');
env.config();

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

const generate3DModel = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const imageBuffer = req.file.buffer;

        // سنستخدم موديل Stable Diffusion XL
        // الموديلات التي تدعم Image-to-Image تختلف قليلاً في الـ Syntax
        const response = await hf.imageToImage({
            model: 'stable-diffusion-v1-5/stable-diffusion-v1-5Free-Law-Project/modernbert-embed-base_finetune_512', // هذا الموديل متاح ومجاني
            inputs: new Blob([imageBuffer]),
            parameters: {
                prompt: req.body.prompt || "a 3d architectural style, high detail",
                strength: 0.7
            }
        });

        const buffer = Buffer.from(await response.arrayBuffer());

        res.set('Content-Type', 'image/png');
        res.send(buffer);

    } catch (err) {
        console.error("HF Error:", err.message);
        res.status(500).json({ success: false, message: "Model currently busy or unavailable. Please try again." });
    }
};

module.exports = { generate3DModel };