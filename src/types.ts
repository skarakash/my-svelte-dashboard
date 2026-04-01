export type TeamPosition = {
    abbr: string;
    drawn: number;
    goals_against: number;
    goals_for: number;
    lost: number;
    name: string;
    played: number;
    points: number;
    position: number;
    season: string;
    season_id: number;
    short_name: string;
    team_id: number;
    won: number;
    icon: string;
    isRelegated: boolean;
    isChampion: boolean;
    cssClass: string;
};

export type SortKey = 'alpha' | 'titles' | 'relegations' | 'points';
export type FilterItem = {
    id: number;
    key: SortKey;
    label: string;
}