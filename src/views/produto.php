<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once(__DIR__ . "/../../templates/header.php");

use Felix\ECommerce\Config\Connection;
use Felix\ECommerce\Controllers\ProdutoController;
use Felix\ECommerce\Models\Produtos;

$id = $_GET['id'];

$database = new Connection();
$conn = $database->getConnection();

$produtosModel = new Produtos($conn);
$produtoController = new ProdutoController($produtosModel);

$produto = $produtoController->show($id);

if ($produto !== null) : ?>
  <!-- Detalhes do Produto -->
  <main>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <img src="<?= $BASE_URL . $produto->getImagem() ?>" class="img-fluid" alt="Imagem do Produto">
        </div>
        <div class="col-md-6">
          <h2><?= $produto->getNome() ?></h2>
          <p><?= $produto->getDescricao() ?></p>
          <p>R$ <?= $produto->getPreco() ?></p>
          <form method="post" action="carrinho.php">
            <input type="hidden" name="add" value="<?= $produto->getId() ?>">
            <input type="submit" value="Adicionar ao Carrinho">
          </form>
        </div>
      </div>
    </div>
  </main>
<?php else : ?>
  <p>Produto não encontrado.</p>
<?php endif;

require_once(__DIR__ . "/../../templates/footer.php");
?>