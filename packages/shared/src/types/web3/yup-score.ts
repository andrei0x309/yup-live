export interface YUPScoreData {
    data: {
        id: string;
        yup_score: number;
        blacklisted: boolean;
        expiration: string;
        score_data: {
            partial: boolean;
            poh: {
                registered: boolean;
            };
            snapshot_votes: {
                score: number;
                count: number;
            };
            eth_erc20_tokens: {
                score: number;
            };
            recent_eth_transfers: {
                score: number;
            };
            recent_polygon_transfers: {
                score: number;
            };
            poly_txn_count: {
                score: number;
                count: number;
            };
            eth_txn_count: {
                score: number;
                count: number;
            };
            eth_age: {
                score: number;
                age: number;
            };
            eth_activity: {
                score: number;
                activity: number;
            };
            polygon_balance: {
                score: number;
                balance: number;
            };
            polygon_nfts: {
                score: number;
            };
            gnosis_nfts: {
                score: number;
            };
            eth_nfts: {
                score: number;
            };
            eth_balance: {
                score: number;
                balance: number;
            };
            ens: {
                score: number;
                count: number;
                primary: string;
            };
        };
    };
}