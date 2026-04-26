type TOrderDetail = {
    bookId: number;
    quantity: number;
    price: string;
};

interface TopsisInput {
    alternatives: Array<{
        id: number;
        customerName: string;
        criteria: {
            stockFulfillment: number;
            urgency: number;
            contractStatus: number;
            returnRate: number;
        };
        orderDetails?: TOrderDetail[];
    }>;
    weights: number[];
}

interface TopsisResult {
    id: number;
    customerName: string;
    score: number;
    rank: number;
    orderDetails?: TOrderDetail[];
}

export class TopsisService {
    private weights: number[];
    private criteriaTypes: ('benefit' | 'cost')[];

    constructor(weights: number[] = ([0.56, 0.26, 0.12, 0.06])) {
        this.weights = weights;
        this.criteriaTypes = ['benefit', 'benefit', 'benefit', 'cost'];
    }

    /**
   * Normalisasi matriks (Euclidean normalization)
   */
    private normalizeMatrix(matrix: number[][]): number[][] {
        const normalized: number[][] = [];
        const numCols = matrix[0].length;

        for (let j = 0; j < numCols; j++) {
            let sumSquares = 0;
            for (let i = 0; i < matrix.length; i++) {
                sumSquares += Math.pow(matrix[i][j], 2);
            }
            const dominator = Math.sqrt(sumSquares);

            if (dominator === 0) continue; // Hindari pembagian dengan nol

            for (let i = 0; i < matrix.length; i++) {
                if (!normalized[i]) normalized[i] = [];
                normalized[i][j] = matrix[i][j] / dominator;
            }
        }
        return normalized;
    }

    /**
     * Matriks ternormalisasi terbobot
     */

    private weightedNormalizedMatrix(normalizeMatrix: number[][]): number[][] {
        const weighted: number[][] = [];
        for (let i = 0; i < normalizeMatrix.length; i++) {
            weighted[i] = [];
            for (let j = 0; j < normalizeMatrix[i].length; j++) {
                weighted[i][j] = normalizeMatrix[i][j] * this.weights[j];
            }
        }
        return weighted;
    }

    /**
     * Solusi ideal positif dan negatif     
     */
    private calculateIdealSolutions(weightedMatrix: number[][]): {
        idealPositive: number[];
        idealNegative: number[];
    } {
        const numCols = weightedMatrix[0].length;
        const idealPositive: number[] = [];
        const idealNegative: number[] = [];

        for (let j = 0; j < numCols; j++) {
            const columnValues = weightedMatrix.map(row => row[j]);

            if (this.criteriaTypes[j] === 'benefit') {
                idealPositive[j] = Math.max(...columnValues);
                idealNegative[j] = Math.min(...columnValues);
            } else {
                idealPositive[j] = Math.min(...columnValues);
                idealNegative[j] = Math.max(...columnValues);
            }

        }

        return { idealPositive, idealNegative };
    }

    /**
     * Jarak ke solusi ideal positif dan negatif
     */
    private calculateDistances(
        weightedMatrix: number[][],
        idealPositive: number[],
        idealNegative: number[]
    ): {
        distPositive: number[];
        distNegative: number[];
    } {
        const distPositive: number[] = [];
        const distNegative: number[] = [];

        for (let i = 0; i < weightedMatrix.length; i++) {
            let sumPositive = 0;
            let sumNegative = 0;

            for (let j = 0; j < weightedMatrix[i].length; j++) {
                sumPositive += Math.pow(weightedMatrix[i][j] - idealPositive[j], 2);
                sumNegative += Math.pow(weightedMatrix[i][j] - idealNegative[j], 2);
            }

            distPositive[i] = Math.sqrt(sumPositive);
            distNegative[i] = Math.sqrt(sumNegative);
        }

        return { distPositive, distNegative };
    }

    /**
   * Skor preferensi (kedekatan relatif terhadap solusi ideal)
   */
  private calculateScores(
    distPositive: number[],
    distNegative: number[]
  ): number[] {
    const scores: number[] = [];
    
    for (let i = 0; i < distPositive.length; i++) {
      const sum = distPositive[i] + distNegative[i];
      scores[i] = sum === 0 ? 0 : distNegative[i] / sum;
    }
    
    return scores;
  }

  /**
   * Main method untuk menghitung TOPSIS
   */
  calculate(input: TopsisInput): TopsisResult[] {
    const { alternatives } = input;
    
    if (alternatives.length === 0) {
      return [];
    }
    
    // 1. Buat matriks keputusan
    const decisionMatrix: number[][] = alternatives.map(alt => [
      alt.criteria.stockFulfillment,
      alt.criteria.urgency,
      alt.criteria.contractStatus,
      alt.criteria.returnRate,
    ]);
    
    // 2. Normalisasi matriks
    const normalizedMatrix = this.normalizeMatrix(decisionMatrix);
    
    // 3. Matriks ternormalisasi terbobot
    const weightedMatrix = this.weightedNormalizedMatrix(normalizedMatrix);
    
    // 4. Solusi ideal
    const { idealPositive, idealNegative } = this.calculateIdealSolutions(weightedMatrix);
    
    // 5. Jarak ke solusi ideal
    const { distPositive, distNegative } = this.calculateDistances(
      weightedMatrix,
      idealPositive,
      idealNegative
    );
    
    // 6. Skor preferensi
    const scores = this.calculateScores(distPositive, distNegative);
    
    // 7. Combine results
    const results: TopsisResult[] = alternatives.map((alt, idx) => ({
      id: alt.id,
      customerName: alt.customerName,
      score: scores[idx],
      rank: 0,
      orderDetails: alt.orderDetails,
    }));
    
    // Sort berdasarkan score (descending) dan beri ranking
    results.sort((a, b) => b.score - a.score);
    results.forEach((result, idx) => {
      result.rank = idx + 1;
    });
    
    return results;
  }
}