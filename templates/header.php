<?php
session_start();

require_once("../../src/config/url.php");
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>e-commerce</title>
  <link rel="stylesheet" href="<?= $BASE_URL ?>assets/Bootstrap/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
</head>

<style>
  .body {
    font-family: 'Poppins', sans-serif;
    padding-bottom: 60px;
    height: 100vh;
  }

  .card-body {
    height: 270px;
    overflow: auto;
  }

  .card {
    width: 80%;
    max-height: 500px;
    margin: 0 auto;
    overflow: auto;
  }

  .card-img-top {
    max-height: 200px;
    object-fit: contain;
    width: 100%;
  }

  .clickable {
    cursor: pointer;
    transition: transform .2s;
  }

  .clickable:hover {
    transform: scale(1.02);
  }

  .img-fluid {
    max-width: 500px;
  }

  .view-details {
    text-decoration: none;
    color: inherit;
  }

  .querLogar:hover {
    background: white;
    color: black;
  }
</style>

<body class="bg-light">

  <header class="bg-warning p-2">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container d-flex justify-content-between">
        <!-- Logo -->
        <a class="navbar-brand" href="<?= $BASE_URL ?>src/views/index.php">E-commerce</a>

        <!-- Formulário de pesquisa -->
        <form class="form-inline d-flex align-items-center my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Pesquisar" aria-label="Search">
          <button class="btn btn-outline-dark ms-3 my-2 my-sm-0" type="submit">
            <i class="fas fa-search"></i>
          </button>
        </form>

        <!-- Usuário logado -->
        <span>
          <?php
          if (isset($_SESSION['admin'])) {
            echo "Olá, " . $_SESSION['admin'];
          } else {
            echo "Você não está logado.";
          }
          ?>
        </span>

        <!-- Logout -->
        <?php if (isset($_SESSION['admin'])) : ?>
          <a class="nav-link p-2 btn btn-danger" href="<?= $BASE_URL ?>src/controllers/logout.php">Sair</a>
        <?php endif; ?>

        <!-- Quer logar? -->
        <?php if (!isset($_SESSION['admin'])) : ?>
          <a class="querLogar nav-link p-2 btn btn-light" href="<?= $BASE_URL ?>src/views/login.php">Faça seu Login</a>
        <?php endif; ?>

        <!-- Carrinho -->
        <a class="nav-link" href="<?= $BASE_URL ?>src/views/carrinho.php"><i class="fas fa-shopping-cart"></i> Carrinho</a>
      </div>
    </nav>
  </header>