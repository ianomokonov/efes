<?php

use PHPUnit\TextUI\XmlConfiguration\Constant;

require_once __DIR__ . '/../utils/database.php';
require_once __DIR__ . '/../utils/constants.php';
require_once __DIR__ . '/../models/user.php';

class Service
{
    private $dataBase;
    private $user;
    private $table = 'Service';

    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
        $this->user = new User($dataBase);
    }

    public function getFilters()
    {
        return Constants::$filters;
    }

    public function getServices($query, $userId)
    {
        if (isset($query['searchString'])) {
            $query['name'] = "LIKE '%" . $this->dataBase->strip($query['searchString']) . "%'";
            unset($query['searchString']);
        }

        $queryArr = $this->dataBase->genSelectQuery($this->table, $query);
        $stmt = $this->dataBase->db->prepare($queryArr[0]);
        $stmt->execute($queryArr[1]);

        $services = [];

        while ($service = $stmt->fetch()) {
            $service['creator'] = $this->user->readShortView($service['creatorId']);
            $service['isFavorite'] = $this->isServiceFavorite($userId, $service['id']);
            $service['workType'] = $this->getFilter('workType', $service['workType'] * 1);
            $service['orderType'] = $this->getFilter('orderType', $service['orderType'] * 1);
            $service['region'] = $this->getFilter('region', $service['region'] * 1);
            $service['endDate'] = $service['endDate'] ? date("Y/m/d H:i:s", strtotime($service['endDate'])) : null;
            unset($service['creatorId']);

            $services[] = $service;
        }

        return $services;
    }

    public function setFavorite($userId, $serviceId)
    {
        try {
            $query = "INSERT INTO UserService (userId, serviceId) VALUES (?, ?)";

            $stmt = $this->dataBase->db->prepare($query);
            $stmt->execute([$userId, $serviceId]);
        } catch (Exception $err) {
            $query = "DELETE FROM UserService WHERE userId=? AND serviceId=?";

            $stmt = $this->dataBase->db->prepare($query);
            $stmt->execute([$userId, $serviceId]);
        }

        return true;
    }

    private function isServiceFavorite($userId, $serviceId)
    {
        $query = "SELECT * FROM UserService WHERE userId=? AND serviceId=?";
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute([$userId, $serviceId]);

        return $stmt->rowCount() > 0;
    }

    private function getFilter($key, $id)
    {
        foreach (Constants::$filters as $filter) {
            if ($filter['key'] == $key) {
                foreach ($filter['values'] as $value) {
                    if ($value['id'] == $id) {
                        return $value;
                    }
                }
            }
        }

        return null;
    }
}
