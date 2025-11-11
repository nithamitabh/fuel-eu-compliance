export class UserModel {
    private pool: any;

    constructor(pool: any) {
        this.pool = pool;
    }

    async createUser(userData: { name: string; email: string }): Promise<void> {
        const query = 'INSERT INTO users (name, email) VALUES ($1, $2)';
        await this.pool.query(query, [userData.name, userData.email]);
    }

    async getUserById(userId: number): Promise<any> {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await this.pool.query(query, [userId]);
        return result.rows[0];
    }
}