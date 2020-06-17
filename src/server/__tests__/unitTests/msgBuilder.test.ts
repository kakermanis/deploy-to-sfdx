import { deployMsgBuilder } from '../../lib/deployMsgBuilder';

describe('urlTestsMaster', () => {
    test('handles master repos', async () => {
        const req = {
            query: {
                template: 'https://github.com/mshanemc/cg4Integrate'
            }
        };

        const message = await deployMsgBuilder(req);
        expect(message.repos[0].repo).toBe('cg4integrate');
        expect(message.repos[0].username).toBe('mshanemc');
        expect(message.repos[0].branch).toBeUndefined();

        // multi
        expect(message.repos).toHaveLength(1);
        expect(message.repos[0].repo).toBe('cg4integrate');
        expect(message.repos[0].username).toBe('mshanemc');
        expect(message.repos[0].branch).toBeUndefined();

        expect(message.deployId).toBeTruthy();
        // username-repo-timestamp
        expect(message.deployId.split('-').length).toBe(3);
        expect(message.deployId.split('-')[0]).toBe(message.repos[0].username);
        expect(message.deployId.split('-')[1]).toBe(message.repos[0].repo);
    });
});

describe('urlTestsBranch', () => {
    test('handles branch repos', async () => {
        const req = {
            query: {
                template: 'https://github.com/mshanemc/cg4Integrate/tree/passwordSet'
            }
        };

        const message = await deployMsgBuilder(req);
        expect(message.firstname).toBeUndefined();
        expect(message.lastname).toBeUndefined();
        expect(message.email).toBeUndefined();

        // multi
        expect(message.repos).toHaveLength(1);

        expect(message.repos[0].username).toBe('mshanemc');
        expect(message.repos[0].repo).toBe('cg4integrate');
        expect(message.repos[0].branch).toBe('passwordSet'); // branches are case sensitive

        expect(message.deployId).toBeTruthy();
        // username-repo-timestamp
        expect(message.deployId.split('-').length).toBe(3);
        expect(message.deployId.split('-')[0]).toBe(message.repos[0].username);
        expect(message.deployId.split('-')[1]).toBe(message.repos[0].repo);
    });

    test('prevents bad urls', async () => {
        const req = {
            query: {
                template: 'https://github.com/mshanemc/df17IntegrationWorkshops/tree/master; wget http://'
            }
        };

        expect(deployMsgBuilder(req)).rejects;
    });
});

describe('userinfo', () => {
    test('handles email, firstname, lastname', async () => {
        const req = {
            query: {
                template: 'https://github.com/mshanemc/cg4Integrate/tree/passwordSet',
                firstname: 'shane',
                lastname: 'mclaughlin',
                email: 'shane.mclaughlin@salesforce.com'
            }
        };

        const message = await deployMsgBuilder(req);

        expect(message.repos[0].username).toBe('mshanemc');
        expect(message.repos[0].repo).toBe('cg4integrate');
        expect(message.repos[0].branch).toBe('passwordSet');
        expect(message.firstname).toBe('shane');
        expect(message.lastname).toBe('mclaughlin');
        expect(message.email).toBe('shane.mclaughlin@salesforce.com');

        expect(message.deployId).toBeTruthy();
        // username-repo-timestamp
        expect(message.deployId.split('-').length).toBe(3);
        expect(message.deployId.split('-')[0]).toBe(message.repos[0].username);
        expect(message.deployId.split('-')[1]).toBe(message.repos[0].repo);
    });
});

describe('multi-template', () => {
    test('handles array of template', async () => {
        const req = {
            query: {
                template: ['https://github.com/mshanemc/cg4Integrate', 'https://github.com/mshanemc/df17IntegrationWorkshops']
            }
        };

        const message = await deployMsgBuilder(req);

        // multi
        expect(message.repos).toHaveLength(2);
        expect(message.repos[0].repo).toBe('cg4integrate');
        expect(message.repos[0].username).toBe('mshanemc');
        expect(message.repos[0].branch).toBeUndefined();

        expect(message.repos[1].repo).toBe('df17integrationworkshops');
        expect(message.repos[1].username).toBe('mshanemc');
        expect(message.repos[1].branch).toBeUndefined();

        expect(message.deployId).toBeTruthy();
        // username-repo-timestamp
        expect(message.deployId.split('-').length).toBe(3);
        expect(message.deployId.split('-')[0]).toBe(message.repos[0].username);
        expect(message.deployId.split('-')[1]).toBe(message.repos[0].repo);
    });

    test('handles branch in array of template', async () => {
        const req = {
            query: {
                template: ['https://github.com/mshanemc/cg4Integrate/tree/passwordSet', 'https://github.com/mshanemc/df17IntegrationWorkshops']
            }
        };

        const message = await deployMsgBuilder(req);

        // multi
        expect(message.repos).toHaveLength(2);
        expect(message.repos[0].repo).toBe('cg4integrate');
        expect(message.repos[0].username).toBe('mshanemc');
        expect(message.repos[0].branch).toBe('passwordSet');

        expect(message.repos[1].repo).toBe('df17integrationworkshops');
        expect(message.repos[1].username).toBe('mshanemc');
        expect(message.repos[1].branch).toBeUndefined();

        expect(message.deployId).toBeTruthy();
        // username-repo-timestamp
        expect(message.deployId.split('-').length).toBe(3);
        expect(message.deployId.split('-')[0]).toBe(message.repos[0].username);
        expect(message.deployId.split('-')[1]).toBe(message.repos[0].repo);
    });
});
