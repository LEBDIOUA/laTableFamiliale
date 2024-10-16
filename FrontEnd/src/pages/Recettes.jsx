import { useEffect, useState } from 'react';
import API from '../handlers/apiService';

function Recettes() {
    const [recettes, setRecettes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecettes = async () => {
        try {
            const response = await API.getRecettes();
            if (response.data) {
                setRecettes(response.data);
            } else if (response.err) {
                setError(response.err);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecettes();
    }, []);

    if (loading) {
        return (
            <main>
                <h2>Chargement des recettes...</h2>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <h2>Erreur : {error.message || error}</h2>
            </main>
        );
    }

    return (
        <main>
            <h2>Recettes</h2>
            <ul>
                {recettes.map((recette, index) => (
                    <li key={index}>{recette.nom}</li>
                ))}
            </ul>
        </main>
    );
}
export default Recettes;
