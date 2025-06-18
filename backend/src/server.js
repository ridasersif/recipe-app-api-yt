// src/server.js
import express from 'express';
import {ENV} from './config/env.js';
import {db} from './config/db.js';
import { favoritesTble } from './db/schema.js'; 
import { eq, and } from 'drizzle-orm';

import { parse } from 'dotenv';

const app = express();
const PORT =ENV.PORT;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World ');
});
app.get('/api/healt', (req, res) => {
  res.status(200).json({
   success: true,
  });
});

app.post('/api/favorites', async (req, res) => {
  try{
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    // Validate required fields
     if (!userId) return res.status(400).json({ success: false, message: 'Missing required field: userId' });
    if (!recipeId) return res.status(400).json({ success: false, message: 'Missing required field: recipeId' });
    if (!title) return res.status(400).json({ success: false, message: 'Missing required field: title' });
    if (!image) return res.status(400).json({ success: false, message: 'Missing required field: image' });
    if (!cookTime) return res.status(400).json({ success: false, message: 'Missing required field: cookTime' });
    if (!servings) return res.status(400).json({ success: false, message: 'Missing required field: servings' });
    
    const newFavorite = await db.insert(favoritesTble).values({
      userId,
      recipeId,
      title,
      image,
      cookTime,
      servings
    })
    .returning();
    res.status(201).json({
      success: true,
      data: newFavorite[0],
    });
  }catch (error) {
    console.error('Error creating favorite:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

});


app.delete('/api/favorites/:userId/:recipeId', async (req, res) => {
  const { id } = req.params;
  try {
    const { userId, recipeId } = req.params;

    await db.delete(favoritesTble).where(
      and(eq(favoritesTble.userId, userId), eq(favoritesTble.recipeId, recipeId, parseInt(recipeId)))
    )
    res.status(200).json({
      success: true,
      message: 'Favorite deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting favorite:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/favorites/:userId', async (req, res) => {
  
  try {
    const { userId } = req.params;
    const userFavorites = await db.select().from(favoritesTble).where(eq(favoritesTble.userId, userId));
    
    if (userFavorites.length === 0) {
      return res.status(404).json({ success: false, message: 'No favorites found for this user' });
    }

    res.status(200).json({
      success: true,
      data: userFavorites,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
})


app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
