
import 'dotenv/config';

export const handleClarifai =  async (req, res, fetch) => {
    const { imageUrl } = req.body; // The URL of the image from the front end
    
    try {
      // Make the Clarifai API call from your server
      const raw = JSON.stringify({
        user_app_id: {
          user_id: 'nash_1129',
          app_id: 'my-first-application-a33ytm'
        },
        inputs: [
          {
            data: {
              image: {
                url: imageUrl
              }
            }
          }
        ]
      });
  
      const response = await fetch('https://api.clarifai.com/v2/models/face-detection/outputs', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Key ${process.env.CLARIFAI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: raw
      });
  
      const result = await response.json();
      res.json(result);  // Send Clarifai’s response back to the client
    } catch (error) {
      console.error('Error calling Clarifai:', error);
      res.status(500).json({ error: 'Unable to process image' });
    }
  };