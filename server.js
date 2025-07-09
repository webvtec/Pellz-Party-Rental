// Import necessary modules
const express = require('express');
const stripe = require('stripe')('your_stripe_secret_key'); // Replace with your actual Stripe secret key
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
const port = 3000; // You can change the port as needed

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Endpoint to create PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
  const { paymentAmount } = req.body;  // Payment amount in dollars

  // Check if the paymentAmount is provided
  if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
    return res.status(400).send({ error: 'Invalid payment amount' });
  }

  try {
    // Create a PaymentIntent with the specified amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount * 100,  // Convert to cents
      currency: 'usd', // You can modify the currency to your requirement
      // Optionally, you can add metadata here like:
      // metadata: { order_id: '12345' }
    });

    // Send back the client secret to the frontend
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
