const canvasWidth = 500;
const canvasHeight = 500;
const entities = [];
let steps = 0;

class Entity {
    constructor(type, x, y, speed, gender = null) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.gender = gender; // "male" or "female" for reproduction
    }

    move() {
        const dx = (Math.random() * 2 - 1) * this.speed; // Random movement scaled by speed
        const dy = (Math.random() * 2 - 1) * this.speed;
        this.x = Math.min(Math.max(this.x + dx, 0), canvasWidth);
        this.y = Math.min(Math.max(this.y + dy, 0), canvasHeight);
    }

    distanceTo(other) {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }
}

function addEntities(type, count, speed) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const gender = Math.random() > 0.5 ? "male" : "female"; // Random gender for reproduction
        entities.push(new Entity(type, x, y, speed, gender));
    }
}

function handleInteractions() {
    for (let i = entities.length - 1; i >= 0; i--) {
        const entity = entities[i];

        for (let j = entities.length - 1; j >= 0; j--) {
            if (i === j) continue;
            const other = entities[j];
            const distance = entity.distanceTo(other);

            // Predator logic
            if (entity.type === 'wolf' && ['sheep', 'chicken', 'rooster'].includes(other.type) && distance <= 4) {
                console.log(`${entity.type} bir ${other.type}'i yedi.`);
                entities.splice(j, 1); // Wolf eats prey
                continue;
            }

            if (entity.type === 'lion' && ['cow', 'sheep'].includes(other.type) && distance <= 5) {
                console.log(`${entity.type} bir ${other.type}'i yedi.`);
                entities.splice(j, 1); // Lion eats prey
                continue;
            }

            if (entity.type === 'hunter' && distance <= 8) {
                console.log(`${entity.type} bir hayvanı öldürdü.`);
                entities.splice(j, 1); // Hunter kills animal
                continue;
            }

            // Reproduction logic
            if (entity.type === other.type && entity.gender !== other.gender && distance <= 3) {
                const x = Math.random() * canvasWidth;
                const y = Math.random() * canvasHeight;
                const gender = Math.random() > 0.5 ? "male" : "female";
                entities.push(new Entity(entity.type, x, y, entity.speed, gender));
                console.log(`${entity.type} türü çoğaldı.`);
            }
        }
    }
}

function countEntities() {
    const counts = entities.reduce((acc, entity) => {
        acc[entity.type] = (acc[entity.type] || 0) + 1;
        return acc;
    }, {});
    console.log('Entity counts after 1000 steps:', counts);
}

// Adding entities with specific speeds
addEntities('sheep', 30, 2); // 30 Sheep
addEntities('cow', 10, 2); // 10 Cows
addEntities('chicken', 10, 1); // 10 Chickens
addEntities('wolf', 10, 3); // 10 Wolves
addEntities('rooster', 10, 1); // 10 Roosters
addEntities('lion', 8, 4); // 8 Lions
addEntities('hunter', 1, 1); // 1 Hunter

function simulate() {
    console.log('Başlangıç durumu:', entities);
    for (steps = 0; steps < 1000; steps++) {
        handleInteractions();
        for (const entity of entities) {
            entity.move();
        }
        if (steps % 100 === 0) { // Her 100 adımda bir çıktı ver
            console.log(`Adım ${steps}, toplam varlık sayısı: ${entities.length}`);
        }
    }
    countEntities();
}

try {
    simulate();
} catch (error) {
    console.error('Bir hata oluştu:', error);
}
