var router = new wepp.RegExpRouter();

router.get('/').to('Main.index');
router.get('/todo').to('Todo.index');

exports.router = router;