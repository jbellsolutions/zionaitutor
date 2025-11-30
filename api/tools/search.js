/**
 * Search educational content
 */
function searchEducationalContent(query, category) {
  const knowledgeBase = {
    space: {
      'black hole': 'A black hole is a region in space where gravity is so strong that nothing, not even light, can escape from it. They form when massive stars collapse.',
      'neutron star': 'A neutron star is an incredibly dense object that forms when a massive star explodes. A teaspoon of neutron star material would weigh as much as a mountain!',
      'planet': 'A planet is a large object that orbits a star. Our solar system has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.',
      'galaxy': 'A galaxy is a huge collection of billions of stars, gas, and dust held together by gravity. We live in the Milky Way galaxy.',
      'sun': 'The Sun is a star at the center of our solar system. It\'s so big that over 1 million Earths could fit inside it!',
      'moon': 'The Moon is Earth\'s natural satellite. It takes about 27 days to orbit around Earth.',
      'star': 'A star is a giant ball of hot gas that produces its own light and heat through nuclear fusion.',
      'asteroid': 'An asteroid is a rocky object that orbits the Sun. Most asteroids are found in the asteroid belt between Mars and Jupiter.'
    },
    science: {
      'tornado': 'A tornado is a violent rotating column of air that extends from a thunderstorm to the ground. They can have winds over 300 mph!',
      'lightning': 'Lightning is a giant spark of electricity in the atmosphere. It can be 5 times hotter than the surface of the Sun!',
      'hurricane': 'A hurricane is a huge storm that forms over warm ocean water. It has powerful winds that spin around a calm center called the eye.',
      'volcano': 'A volcano is an opening in Earth\'s crust where hot melted rock (magma), ash, and gases escape from underground.',
      'earthquake': 'An earthquake happens when pieces of Earth\'s crust suddenly move. This can make the ground shake.',
      'cloud': 'Clouds are made of tiny water droplets or ice crystals floating in the sky. Different types of clouds can tell us about the weather.'
    },
    math: {
      'multiplication': 'Multiplication is repeated addition. For example, 5 × 4 means adding 5 four times: 5 + 5 + 5 + 5 = 20.',
      'fraction': 'A fraction represents a part of a whole. Like if you cut a pizza into 8 slices and eat 3, you ate 3/8 of the pizza.',
      'addition': 'Addition means putting numbers together to find the total. Like 5 + 3 = 8.',
      'subtraction': 'Subtraction means taking away. Like if you have 10 cookies and eat 3, you have 10 - 3 = 7 left.'
    },
    general: {
      'dinosaur': 'Dinosaurs were reptiles that lived millions of years ago. Some were huge like Brachiosaurus, others were small like Compsognathus.',
      'ocean': 'The ocean covers over 70% of Earth\'s surface. It\'s home to millions of different plants and animals.',
      'tree': 'Trees are tall plants with woody stems called trunks. They make oxygen for us to breathe and provide homes for many animals.'
    }
  };

  const results = [];
  const searchQuery = query.toLowerCase();

  // Search in knowledge base
  for (const [cat, topics] of Object.entries(knowledgeBase)) {
    if (!category || category === cat) {
      for (const [topic, content] of Object.entries(topics)) {
        if (searchQuery.includes(topic) || topic.includes(searchQuery)) {
          results.push({
            topic,
            category: cat,
            content,
            relevance: 'high'
          });
        }
      }
    }
  }

  // If no results, return helpful message
  if (results.length === 0) {
    results.push({
      topic: 'Information',
      content: `I don't have specific information about "${query}" in my knowledge base yet. Let me help you explore this topic by asking you what you already know about it, or we can look it up together!`,
      relevance: 'medium'
    });
  }

  return results;
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { query, category } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const results = await searchEducationalContent(query, category);

    res.status(200).json({
      success: true,
      query,
      results
    });
  } catch (error) {
    console.error('Error in search tool:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
};
