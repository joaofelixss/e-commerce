import { PartialType } from '@nestjs/mapped-types';
import { CreateVariacaoDto } from './create-produto.dto'; // Reutilizamos o CreateVariacaoDto

export class UpdateVariacaoDto extends PartialType(CreateVariacaoDto) {}
