/**
 * @class Presets
 * 
 * The `Presets` class represents a user's preset configuration for their journey.
 * It includes details such as marital status, family status, and the purpose of their purchase.
 * 
 * This class also provides a method to update the preset, allowing modification of the preset
 * attributes like `maritalStatus`, `familyStatus`, and `purchasePurpose`.
 */
class Presets {

    private presetID: number;
    private maritalStatus: string;
    private familyStatus: string;
    private purchasePurpose: string;

    /**
     * Creates an instance of `Presets`.
     * 
     * @param {number} presetID - The unique identifier for the preset.
     * @param {string} maritalStatus - The marital status of the user (e.g., "Single", "Married").
     * @param {string} familyStatus - The family status of the user (e.g., "With Children", "Without Children").
     * @param {string} purchasePurpose - The purpose of the purchase (e.g., "Buying", "Renting").
     */
    constructor(presetID: number, maritalStatus: string, familyStatus: string, purchasePurpose: string) {
        this.presetID = presetID;
        this.maritalStatus = maritalStatus;
        this.familyStatus = familyStatus;
        this.purchasePurpose = purchasePurpose;
    }

    /**
     * Retrieves the unique identifier for the preset.
     * 
     * @returns {number} The preset ID.
     */
    getPresetID(): number {
        return this.presetID;
    }

    /**
     * Retrieves the marital status of the user.
     * 
     * @returns {string} The user's marital status.
     */
    getMaritalStatus(): string {
        return this.maritalStatus;
    }

    /**
     * Retrieves the family status of the user.
     * 
     * @returns {string} The user's family status.
     */
    getFamilyStatus(): string {
        return this.familyStatus;
    }

    /**
     * Retrieves the purchase purpose of the user.
     * 
     * @returns {string} The purpose of the user's purchase.
     */
    getPurchasePurpose(): string {
        return this.purchasePurpose;
    }

    /**
     * Updates the preset with new information.
     * 
     * This method allows updating the preset's attributes like marital status,
     * family status, and purchase purpose.
     * 
     * @param {number} presetID - The unique identifier for the preset to be updated.
     * @param {string} maritalStatus - The updated marital status.
     * @param {string} familyStatus - The updated family status.
     * @param {string} purchasePurpose - The updated purchase purpose.
     */
    updatePreset(presetID: number, maritalStatus: string, familyStatus: string, purchasePurpose: string): void {
        if (this.presetID === presetID) {
            this.maritalStatus = maritalStatus;
            this.familyStatus = familyStatus;
            this.purchasePurpose = purchasePurpose;
        } 
        else {
            console.error(`Preset with ID ${presetID} does not exist or cannot be updated.`);
        }
    }

}

export default Presets;