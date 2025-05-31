import cron from 'node-cron';
import sendMail from '../service/mail';
import { User } from '../models/user';

export const sharePlatform = async () => {
    cron.schedule('0 9 */3 * *', async () => {
        try {
        const users = await User.find({});
    
        for (const user of users) {
            await sendMail({
            to: user.email,
            type: 'SHARE_PLATFORM',
            data: {
                name: user.name
            }
            });
        }
        
        } catch (err) {
        console.error('Error sending share platform emails:', err);
        }
    });
}
