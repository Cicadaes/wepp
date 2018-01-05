var router = new wepp.RegExpRouter();

router.get('/').to('Main.index');

exports.router = router;