<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

require_once 'vendor/autoload.php';
require_once './utils/database.php';
require_once './utils/token.php';
require_once './models/user.php';
require_once './models/service.php';

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Psr7\Response as ResponseClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use Slim\Routing\RouteContext;

$dataBase = new DataBase();
$user = new User($dataBase);
$service = new Service($dataBase);
$token = new Token();
$app = AppFactory::create();
$app->setBasePath(rtrim($_SERVER['PHP_SELF'], '/index.php'));

// Add error middleware
$app->addErrorMiddleware(true, true, true);
// Add routess
$app->post('/login', function (Request $request, Response $response) use ($dataBase) {

    $user = new User($dataBase);
    $requestData = $request->getParsedBody();
    try {
        $response->getBody()->write(json_encode($user->login($requestData['email'], $requestData['password'])));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "Пользователь не найден")));
        return $response->withStatus(401);
    }
});

$app->get('/roles', function (Request $request, Response $response) use ($dataBase) {
    $user = new User($dataBase);
    try {
        $response->getBody()->write(json_encode($user->getRoles()));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "Ошибка загрузки ролей")));
        return $response->withStatus(401);
    }
});

$app->post('/sign-up', function (Request $request, Response $response) use ($dataBase) {
    $user = new User($dataBase);
    try {
        $response->getBody()->write(json_encode($user->create((object) $request->getParsedBody())));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "Пользователь уже существует")));
        return $response->withStatus(401);
    }
});

$app->post('/refresh-token', function (Request $request, Response $response) use ($dataBase) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->refreshToken($request->getParsedBody()['token'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(401);
    }
});

$app->post('/delete-token', function (Request $request, Response $response) use ($dataBase) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->removeRefreshToken($request->getParsedBody()['token'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(401);
    }
});

$app->post('/update-password', function (Request $request, Response $response) use ($dataBase) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->getUpdateLink($request->getParsedBody()['email'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(500);
    }
});

$app->group('/', function (RouteCollectorProxy $group) use ($user, $service) {

    $group->group('user', function (RouteCollectorProxy $userGroup) use ($user) {
        $userGroup->get('', function (Request $request, Response $response) use ($user) {
            try {
                $response->getBody()->write(json_encode($user->read($request->getAttribute('userId'))));
                return $response;
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка загрузки пользователя")));
                return $response->withStatus(401);
            }
        });

        $userGroup->get('/profile-info', function (Request $request, Response $response) use ($user) {
            try {
                $response->getBody()->write(json_encode($user->getProfileInfo($request->getAttribute('userId'))));
                return $response;
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка загрузки пользователя")));
                return $response->withStatus(401);
            }
        });

        $userGroup->post('/document', function (Request $request, Response $response) use ($user) {
            try {
                $response->getBody()->write(json_encode($user->addDocument($request->getAttribute('userId'), $request->getParsedBody(), $_FILES['file'])));
                return $response;
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка загрузки документа")));
                return $response->withStatus(500);
            }
        });

        $userGroup->delete('/document/{documentId}', function (Request $request, Response $response) use ($user) {
            try {

                $routeContext = RouteContext::fromRequest($request);
                $route = $routeContext->getRoute();
                $documentId = $route->getArgument('documentId');
                $response->getBody()->write(json_encode($user->deleteDocument($request->getAttribute('userId'), $documentId)));
                return $response;
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка загрузки пользователя")));
                return $response->withStatus(401);
            }
        });

        $userGroup->post('/company-info', function (Request $request, Response $response) use ($user) {
            try {
                $response->getBody()->write(json_encode($user->addCompanyInfo($request->getAttribute('userId'), $request->getParsedBody())));
                return $response;
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка добавления компании")));
                return $response->withStatus(401);
            }
        });

        $userGroup->put('/company-info', function (Request $request, Response $response) use ($user) {
            try {
                $response->getBody()->write(json_encode($user->updateCompanyInfo($request->getAttribute('userId'), $request->getParsedBody())));
                return $response;
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка изменения компании")));
                return $response->withStatus(401);
            }
        });

        $userGroup->put('', function (Request $request, Response $response) use ($user) {
            try {
                $response->getBody()->write(json_encode($user->update($request->getAttribute('userId'), $request->getParsedBody())));
                return $response;
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка загрузки пользователя")));
                return $response->withStatus(401);
            }
        });
    });

    $group->group('services', function (RouteCollectorProxy $servicesGroup) use ($service) {
        $servicesGroup->get('', function (Request $request, Response $response) use ($service) {
            try {
                $response->getBody()->write(json_encode($service->getServices($request->getQueryParams(), $request->getAttribute('userId'))));
                return $response;
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка загрузки услуг")));
                return $response->withStatus(500);
            }
        });

        $servicesGroup->get('/filters', function (Request $request, Response $response) use ($service) {
            try {
                $response->getBody()->write(json_encode($service->getFilters()));
                return $response;
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка загрузки фильтров")));
                return $response->withStatus(500);
            }
        });

        $servicesGroup->group('/{serviceId}', function (RouteCollectorProxy $serviceGroup) use ($service) {
            $serviceGroup->get('/favorite', function (Request $request, Response $response) use ($service) {
                try {
                    $response->getBody()->write(json_encode($service->setFavorite($request->getAttribute('userId'), $request->getAttribute('serviceId'))));
                    return $response;
                } catch (Exception $e) {
                    $response->getBody()->write(json_encode(array("e" => $e, "message" => "Ошибка добавления в избранное")));
                    return $response->withStatus(500);
                }
            });
        })->add(function (Request $request, RequestHandler $handler) {
            $routeContext = RouteContext::fromRequest($request);
            $route = $routeContext->getRoute();
            $request = $request->withAttribute('serviceId', $route->getArgument('serviceId'));
            $response = $handler->handle($request);

            return $response;
        });
    });

    // $group->group('admin', function (RouteCollectorProxy $adminGroup) use ($dataBase) {
    // })->add(function (Request $request, RequestHandler $handler) use ($dataBase) {
    //     $userId = $request->getAttribute('userId');

    //     $user = new User($dataBase);

    //     if ($user->checkAdmin($userId)) {
    //         return $handler->handle($request);
    //     }

    //     $response = new ResponseClass();
    //     $response->getBody()->write(json_encode(array("message" => "Отказано в доступе к функционалу администратора")));
    //     return $response->withStatus(403);
    // });
})->add(function (Request $request, RequestHandler $handler) use ($token) {
    try {
        $jwt = explode(' ', $request->getHeader('Authorization')[0])[1];
        $userId = $token->decode($jwt)->data->id;
        $request = $request->withAttribute('userId', $userId);
        $response = $handler->handle($request);

        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        echo json_encode($e);
        $response->getBody()->write(json_encode($e));
        if ($e->getCode() && $e->getCode() != 0) {
            return $response->withStatus($e->getCode());
        }
        return $response->withStatus(500);
    }
});

$app->run();
