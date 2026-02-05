export interface SM2Input {
    q: number; // 0-5 grade (0: blackout, 5: perfect)
    repetition: number;
    ef: number; // Ease Factor
    interval: number; // Days
}

export interface SM2Output {
    repetition: number;
    ef: number;
    interval: number;
    nextReviewDate: Date;
}

export const calculateSM2 = ({ q, repetition, ef, interval }: SM2Input): SM2Output => {
    let newRepetition = repetition;
    let newEf = ef;
    let newInterval = interval;

    if (q >= 3) {
        // Correct response
        if (repetition === 0) {
            newInterval = 1;
        } else if (repetition === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(interval * ef);
        }
        newRepetition += 1;
    } else {
        // Incorrect response
        newRepetition = 0;
        newInterval = 1;
    }

    // Update Ease Factor
    // EF' = EF + (0.1 - (5-q) * (0.08 + (5-q)*0.02))
    newEf = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

    // Lower limit for EF is 1.3
    if (newEf < 1.3) newEf = 1.3;

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
        repetition: newRepetition,
        ef: newEf,
        interval: newInterval,
        nextReviewDate, // Returns Date object, handle ISO string conversion at usage
    };
};
