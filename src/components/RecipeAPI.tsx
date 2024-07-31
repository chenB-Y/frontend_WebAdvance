import React, { useState } from 'react';
import axios from 'axios';
import '../style/recipe.css'; // Import a CSS file for custom styling

interface Recipe {
    title: string;
    ingredients: string; // Ingredients as a string
    instructions: string;
    servings: string;
}

const RecipeFinder: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Add loading state

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        setLoading(true); // Start loading

        try {
            const response = await axios.get('https://api.api-ninjas.com/v1/recipe', {
                params: { query: query.trim() },
                headers: { 'X-Api-Key': 'r9k2OVE1wygvgv5tuiQ0vw==kM8eaWRcCELwjpte' },
            });
            setRecipes(response.data);
            setError('');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setLoading(false); // End loading
                setError(`Error fetching recipes: ${err.response?.status} ${err.response?.statusText}`);
            } else {
                setLoading(false); // End loading
                setError('Error fetching recipes');
            }
            setRecipes([]);
        }finally{
            setLoading(false); // End loading
        }
    };

    return (
        <div className="recipe-finder">
            <h1 className="title">Recipe Finder</h1>
            <form onSubmit={handleSubmit} className="search-form">
                <label htmlFor="query" className="label">Enter recipe query:</label>
                <input
                    type="text"
                    id="query"
                    name="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="input"
                    required
                />
                <button type="submit" className="button">Search</button>
            </form>
            {loading && <p className="loading">Loading...</p>}
            <div className="results">
                {error && <p className="error">{error}</p>}
                {!loading && recipes.length > 0 ? (
                    recipes.map((recipe, index) => (
                        <div key={index} className="recipe-card">
                            <h2 className="recipe-title">{recipe.title}</h2>
                            <p><strong>Ingredients:</strong> {recipe.ingredients.split('|').join(', ')}</p>
                            <p><strong>Instructions:</strong> {recipe.instructions}</p>
                            <p><strong>servings:</strong> {recipe.servings}</p>
                        </div>
                    ))
                ) : (
                    !loading && !error && <p>No recipes found.</p>
                )}
            </div>
        </div>
    );
};

export default RecipeFinder;
