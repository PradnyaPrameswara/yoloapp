/**
 * Utility for importing images with fallback support
 * Attempts to load PNG first, then JPG if PNG fails
 */

// Helper function to import images with fallback
export const importImage = (imageName) => {
    try {
        // Try PNG first
        return require(`../assets/signs/${imageName}.png`);
    } catch (e) {
        try {
            // Fallback to JPG
            return require(`../assets/signs/${imageName}.jpg`);
        } catch (e2) {
            // If neither exists, return null or a placeholder
            console.warn(`Image not found: ${imageName} (tried both .png and .jpg)`);
            return null;
        }
    }
};

// Import all sign language images
export const loadSignImages = () => {
    return {
        imgNum0: importImage('number_0'),
        imgNum1: importImage('number_1'),
        imgNum2: importImage('number_2'),
        imgNum3: importImage('number_3'),
        imgNum4: importImage('number_4'),
        imgNum5: importImage('number_5'),
        imgNum6: importImage('number_6'),
        imgNum7: importImage('number_7'),
        imgNum8: importImage('number_8'),
        imgNum9: importImage('number_9'),
        imgTambah: importImage('operator_tambah'),
        imgKurang: importImage('operator_kurang'),
        imgKali: importImage('operator_kali'),
        imgBagi: importImage('operator_bagi'),
        imgStart: importImage('command_start'),
        imgUndefined: importImage('command_undefined')
    };
};
