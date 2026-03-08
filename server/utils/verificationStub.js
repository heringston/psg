/**
 * Verification Stubs
 * ─────────────────
 * These functions simulate external API calls to verify
 * FSSAI and NGO Darpan IDs. In production, replace these
 * with actual API integrations.
 */

/**
 * Stub: Verify an FSSAI License ID.
 * In production, this would call the FSSAI API.
 * @param {string} fssaiId - The FSSAI license number
 * @returns {Promise<{valid: boolean, message: string}>}
 */
const verifyFSSAI = async (fssaiId) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Stub logic: IDs starting with '1' are considered valid
    if (fssaiId && fssaiId.length >= 8 && fssaiId.startsWith('1')) {
        return {
            valid: true,
            message: 'FSSAI ID verified successfully.',
        };
    }

    return {
        valid: false,
        message: 'FSSAI ID could not be verified. Please check and try again.',
    };
};

/**
 * Stub: Verify an NGO Darpan Unique ID.
 * In production, this would call the NGO Darpan portal API.
 * @param {string} darpanId - The NGO Darpan unique ID
 * @returns {Promise<{valid: boolean, message: string}>}
 */
const verifyNGODarpan = async (darpanId) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Stub logic: IDs starting with 'DL' or 'MH' are considered valid
    if (darpanId && darpanId.length >= 6 && (darpanId.startsWith('DL') || darpanId.startsWith('MH'))) {
        return {
            valid: true,
            message: 'NGO Darpan ID verified successfully.',
        };
    }

    return {
        valid: false,
        message: 'NGO Darpan ID could not be verified. Please check and try again.',
    };
};

module.exports = { verifyFSSAI, verifyNGODarpan };
