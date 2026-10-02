const cron = require('node-cron');

const pendingTransactionService =
    require('../services/cronjobAutomation');


// Run every 1 minute
cron.schedule('* * * * *', async () => {

    console.log('Running pending transaction worker...');

    await pendingTransactionService.monnifypendingReview()
    await pendingTransactionService.vtpasspendingFlow()
    await pendingTransactionService.vtpassDATApendingFlow()
    await pendingTransactionService.eletricity_automation_flow()

});


